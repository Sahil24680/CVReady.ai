# Generated by Django 5.1.7 on 2025-04-01 02:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('AIResumeCheck', '0002_rename_resume_resume_data_alter_resume_data_table'),
    ]

    operations = [
        migrations.RenameField(
            model_name='resume_data',
            old_name='User_name',
            new_name='Resume_name',
        ),
        migrations.RemoveField(
            model_name='resume_data',
            name='extracted_data',
        ),
        migrations.RemoveField(
            model_name='resume_data',
            name='feedback_score',
        ),
        migrations.RemoveField(
            model_name='resume_data',
            name='resume_text',
        ),
    ]
