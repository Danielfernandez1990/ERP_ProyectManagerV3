import { Response, Request, NextFunction } from 'express';
import logger from '../utils/logger';

interface MetricaMonitor {
  endpoint: string;
  metodo: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  usuario?: string;
  error?: string;
}

class MonitoringService {
  private metricas: MetricaMonitor[] = [];
  private readonly MAX_METRICAS = 10000;

  /**
   * Middleware para capturar métricas
   */
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const inicio = Date.now();
      const authReq = req as any;

      res.on('finish', () => {
        const responseTime = Date.now() - inicio;
        const metrica: MetricaMonitor = {
          endpoint: req.path,
          metodo: req.method,
          statusCode: res.statusCode,
          responseTime,
          timestamp: new Date(),
          usuario: authReq.user?.email || 'anonymous',
        };

        this.registrarMetrica(metrica);

        // Log slow requests
        if (responseTime > 1000) {
          logger.warn('Slow request detected:', {
            endpoint: req.path,
            metodo: req.method,
            responseTime,
          });
        }

        // Alert on errors
        if (res.statusCode >= 500) {
          logger.error('Server error:', {
            endpoint: req.path,
            statusCode: res.statusCode,
          });
        }
      });

      next();
    };
  }

  /**
   * Registrar métrica
   */
  private registrarMetrica(metrica: MetricaMonitor) {
    this.metricas.push(metrica);

    // Mantener límite de métricas en memoria
    if (this.metricas.length > this.MAX_METRICAS) {
      this.metricas = this.metricas.slice(-this.MAX_METRICAS);
    }
  }

  /**
   * Obtener estadísticas
   */
  getEstadisticas(ultimosMinutos: number = 60) {
    const ahora = Date.now();
    const hace = ahora - ultimosMinutos * 60 * 1000;

    const metricasFiltradas = this.metricas.filter(
      (m) => m.timestamp.getTime() > hace,
    );

    const statusCodes = this.agruparPor(metricasFiltradas, 'statusCode');
    const endpoints = this.agruparPor(metricasFiltradas, 'endpoint');

    const tiemposRespuesta = metricasFiltradas.map((m) => m.responseTime);
    const tiemposOrdenados = tiemposRespuesta.sort((a, b) => a - b);

    return {
      totalRequests: metricasFiltradas.length,
      statusCodes,
      endpoints,
      responseTime: {
        min: Math.min(...tiemposRespuesta, 0),
        max: Math.max(...tiemposRespuesta, 0),
        promedio: this.promedio(tiemposRespuesta),
        p50: this.percentil(tiemposOrdenados, 50),
        p95: this.percentil(tiemposOrdenados, 95),
        p99: this.percentil(tiemposOrdenados, 99),
      },
      erroresUltimaHora: metricasFiltradas.filter((m) => m.statusCode >= 500).length,
    };
  }

  /**
   * Obtener salud del sistema
   */
  getHealth() {
    const stats = this.getEstadisticas(5); // Últimos 5 minutos

    const tazaError = stats.totalRequests > 0
      ? (stats.erroresUltimaHora / stats.totalRequests) * 100
      : 0;

    const responseTimeOk = stats.responseTime.p95 < 500;
    const errorRateOk = tazaError < 5;

    const status = responseTimeOk && errorRateOk ? 'healthy' : 'degraded';

    return {
      status,
      responseTime: stats.responseTime.p95,
      errorRate: tazaError.toFixed(2),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    };
  }

  /**
   * Agrupar por propiedad
   */
  private agruparPor(arr: MetricaMonitor[], propiedad: string) {
    return arr.reduce((acc: any, item: any) => {
      const clave = item[propiedad];
      acc[clave] = (acc[clave] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Calcular promedio
   */
  private promedio(arr: number[]) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  /**
   * Calcular percentil
   */
  private percentil(arr: number[], p: number) {
    if (arr.length === 0) return 0;
    const indice = Math.ceil((p / 100) * arr.length) - 1;
    return arr[Math.max(0, indice)];
  }

  /**
   * Exportar métricas
   */
  exportarParaDatadog() {
    const stats = this.getEstadisticas();
    const health = this.getHealth();

    return {
      metrics: [
        {
          metric: 'erp.requests.total',
          points: [[Date.now() / 1000, stats.totalRequests]],
        },
        {
          metric: 'erp.response.time.p95',
          points: [[Date.now() / 1000, stats.responseTime.p95]],
        },
        {
          metric: 'erp.errors.rate',
          points: [[Date.now() / 1000, parseFloat(health.errorRate)]],
        },
        {
          metric: 'erp.memory.usage',
          points: [[Date.now() / 1000, health.memory.heapUsed]],
        },
      ],
    };
  }

  /**
   * Generar reporte
   */
  generarReporte() {
    const stats = this.getEstadisticas(1440); // 24 horas
    const health = this.getHealth();

    return {
      titulo: 'ERP V3.0 - Reporte de Monitoreo',
      fecha: new Date().toISOString(),
      salud: health,
      estadisticas: stats,
      recomendaciones: this.generarRecomendaciones(stats, health),
    };
  }

  /**
   * Generar recomendaciones
   */
  private generarRecomendaciones(stats: any, health: any) {
    const recomendaciones: string[] = [];

    if (stats.responseTime.p95 > 500) {
      recomendaciones.push('Considera optimizar endpoints lentos');
    }

    if (parseFloat(health.errorRate) > 5) {
      recomendaciones.push('Tasa de error alta, verificar logs');
    }

    if (health.memory.heapUsed > health.memory.heapTotal * 0.8) {
      recomendaciones.push('Uso de memoria alto, considera reiniciar o escalar');
    }

    return recomendaciones;
  }
}

export default new MonitoringService();
