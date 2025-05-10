
# Register your models here.
from django.contrib import admin
from .models import Note
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at', 'updated_at')
    search_fields = ('title', 'content')
    list_filter = ('created_at', 'updated_at')

admin.site.register(Note, NoteAdmin)