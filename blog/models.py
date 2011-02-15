from django import forms
from django.forms import ModelForm
from django.db import models

#models
class Tag(models.Model):
    keyword = models.CharField(max_length=100)
    
    def __unicode__(self):
        return self.keyword

class Post(models.Model):
    timestamp = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=200)
    public = models.BooleanField()
    content = models.TextField()
    tags = models.ManyToManyField(Tag, blank=True)

    def __unicode__(self):
        return self.title

class Comment(models.Model):
    timestamp = models.DateTimeField(auto_now=True)
    post = models.ForeignKey(Post)
    name = models.CharField(max_length=100)
    content = models.CharField(max_length=1024)

    
#validators
def novalidation(value):
    return True

#forms
class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ('title',
                  'public',
                  'tags',
                  'content',)
        
    public = forms.BooleanField(initial=True, required=False)
    
    def __init__(self, *args, **kwargs):
        super(PostForm, self).__init__(*args, **kwargs)
     #   self.fields['tag'].choices = [(t.keyword, t.keyword) for t in Tag.objects.all()]
        
        
                                      
