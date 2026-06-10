from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer
from django.db.models import Case, When, IntegerField

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        qs = Task.objects.select_related("category").annotate(
      priority_rank=Case(
          When(priority="high", then=0),
          When(priority="medium", then=1),
          When(priority="low", then=2),
          output_field=IntegerField(),
      )
  ).order_by("-due_date", "priority_rank")
  
        category_id = self.request.query_params.get("category")
        if category_id:
            qs = qs.filter(category_id=category_id)
        return qs

    @action(detail=True, methods=["post"])
    def toggle(self, request, pk=None):
        task = self.get_object()
        task.completed = not task.completed
        task.save()
        return Response(TaskSerializer(task).data)
