from django import forms

class PostForm(forms.form):
    title = forms.CharField()
    public = forms.BooleanField(required=True)
