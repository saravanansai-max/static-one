How to Update or Add Articles

1. Open the articles.json file.
2. Find the desired article by its id field.

3. Modify any of the following fields:
   title – article title
   description – main article text (can be very long)
   author – article author
   date – date in the format YYYY-MM-DD
   images – array of image URLs (0 to 5 items)
   tags – array of article tags

Adding a New Article

1. Open the articles.json file.
2. Add a new object to the articles array:
   {
   "id": 6,
   "title": "New article title",
   "description": "Text of the new article...",
   "author": "Author name",
   "date": "2024-01-15",
   "images": [
   "path to image",
   "path to image"
   ],
   "tags": ["Tag1", "Tag2", "Tag3"]
   }
3. Increase the id value by 1 for each new article.
4. Save the file.
