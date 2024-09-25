from django.db import models
from django.contrib.auth.models import User
from PIL import Image
# Create your models here.

class Products(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    productname = models.CharField(max_length = 100)
    image = models.ImageField(null=True,blank=True)
    productbrand = models.CharField(max_length = 100, blank=True , null=True)
    productcategory = models.CharField(max_length = 100, blank = True, null=True)
    productinfo = models.TextField(null= True , blank = True)
    rating = models.DecimalField(max_digits=8 , decimal_places = 1 , null= True , blank= True)
    reviews = models.IntegerField(null= True , blank = True, default=0)
    price = models.DecimalField(max_digits=7 , decimal_places = 2 , null = True , blank= True)
    stockcount = models.IntegerField(null= True, blank = True ,default= 0)
    created_at = models.DateTimeField(auto_now_add=True)
    id = models.AutoField(primary_key= True , editable= False)
    
    def __str__(self) -> str:
        return self.productname
    
    
def save(self, *args, **kwargs):
    super().save(*args, **kwargs)

    img = Image.open(self.image.path)
    output_size = (300, 300)

    # Resize while maintaining the aspect ratio
    img.thumbnail((300, 300), Image.ANTIALIAS)

    # Calculate cropping box to center the image
    left = (img.width - 300) / 2
    top = (img.height - 300) / 2
    right = (img.width + 300) / 2
    bottom = (img.height + 300) / 2

    # Crop the image to the center
    img = img.crop((left, top, right, bottom))
    img.save(self.image.path)
