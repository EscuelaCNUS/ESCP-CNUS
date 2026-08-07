export function reportWebVitals(metric) {
  if (process.env.NODE_ENV !== 'production') return;
  console.log(`[Web Vitals] ${metric.name}: ${metric.value}`);
}
