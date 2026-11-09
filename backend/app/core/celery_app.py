import os

try:
    from celery import Celery
    broker_url = os.getenv("CELERY_BROKER_URL", "memory://")
    celery_app = Celery("flowzint", broker=broker_url)
    celery_app.conf.update(task_always_eager=True)
except ImportError:
    class MockCelery:
        def task(self, *args, **kwargs):
            def decorator(func):
                func.delay = lambda *a, **k: func(*a, **k)
                return func
            return decorator

    celery_app = MockCelery()
