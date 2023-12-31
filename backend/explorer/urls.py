from django.urls import path
from . import views

urlpatterns = [
    path('relays/', views.RelayListCreateView.as_view(), name='relay-list-create'),
    path('relays/<uuid:id>/', views.RelayRetrieveView.as_view()),
]
