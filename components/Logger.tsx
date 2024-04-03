// For demo purposes lets create a Logger service.
// In real world, we would call AppInsights or some other logging service to log failures to
class Logger {
  static Error(e: any) {
    console.log(e);
  }
}

export default Logger;
