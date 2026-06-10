from datetime import date, timedelta

from django.core.management.base import BaseCommand

from tasks.models import Category, Task


class Command(BaseCommand):
    help = "Seed the database with example categories and tasks."

    def handle(self, *args, **options):
        Task.objects.all().delete()
        Category.objects.all().delete()

        categories = {
            "Work": "#3b82f6",
            "Personal": "#22c55e",
            "Learning": "#a855f7",
            "Errands": "#f59e0b",
        }
        cat_objs = {
            name: Category.objects.create(name=name, color=color)
            for name, color in categories.items()
        }

        today = date.today()
        examples = [
            ("Review PR #482", "Look over the auth refactor", "Work", "high", today),
            ("Reply to Jamie's email", "RE: roadmap question", "Work", "medium", today + timedelta(days=1)),
            ("Buy groceries", "Milk, bread, coffee, eggs", "Errands", "low", today + timedelta(days=2)),
            ("Read 'Designing Data-Intensive Apps' ch.5", "", "Learning", "medium", today + timedelta(days=7)),
            ("Renew gym membership", "", "Personal", "low", today + timedelta(days=10)),
            ("Deploy staging release", "Tag v1.4.0 and run smoke tests", "Work", "high", today),
            ("Practice React Query basics", "Tutorial part 1-3", "Learning", "medium", today + timedelta(days=3)),
            ("Schedule dentist appointment", "", "Personal", "low", today + timedelta(days=14)),
            ("Review PR #482", "Look over the auth refactor", "Work", "high", today),
            ("Reply to Jamie's email", "RE: roadmap question", "Work", "medium", today + timedelta(days=1)),
            ("Buy groceries", "Milk, bread, coffee, eggs", "Errands", "low", today + timedelta(days=2)),
            ("Read 'Designing Data-Intensive Apps' ch.5", "", "Learning", "medium", today + timedelta(days=7)),
            ("Renew gym membership", "", "Personal", "low", today + timedelta(days=10)),
            ("Deploy staging release", "Tag v1.4.0 and run smoke tests", "Work", "high", today),
            ("Practice React Query basics", "Tutorial part 1-3", "Learning", "medium", today + timedelta(days=3)),
            ("Schedule dentist appointment", "", "Personal", "low", today + timedelta(days=14)),
            ("Review PR #482", "Look over the auth refactor", "Work", "high", today),
            ("Reply to Jamie's email", "RE: roadmap question", "Work", "medium", today + timedelta(days=1)),
            ("Buy groceries", "Milk, bread, coffee, eggs", "Errands", "low", today + timedelta(days=2)),
            ("Read 'Designing Data-Intensive Apps' ch.5", "", "Learning", "medium", today + timedelta(days=7)),
            ("Renew gym membership", "", "Personal", "low", today + timedelta(days=10)),
            ("Deploy staging release", "Tag v1.4.0 and run smoke tests", "Work", "high", today),
            ("Practice React Query basics", "Tutorial part 1-3", "Learning", "medium", today + timedelta(days=3)),
            ("Schedule dentist appointment", "", "Personal", "low", today + timedelta(days=14)),
        ]

        for title, desc, cat_name, priority, due in examples:
            Task.objects.create(
                title=title,
                description=desc,
                category=cat_objs[cat_name],
                priority=priority,
                due_date=due,
            )

        # Mark one as completed for variety
        first = Task.objects.filter(title="Buy groceries").first()
        if first:
            first.completed = True
            first.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {Category.objects.count()} categories and {Task.objects.count()} tasks."
            )
        )
