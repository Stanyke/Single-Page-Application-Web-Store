# Single-Page-Application-Web-Store

This is a single page application (SPA) for a web store with CRUD operations which is live on https://single-page-web-store.herokuapp.com/ and was equally built with NodeJS with help of **jQuery** for it's **ajax** processing on routes & **dust** package manager to display its frontend view (html) with ease.

This web application uses PostgreSQL (ElephantSQL online server) to store its data including image, but it just stores the image name after renaming it from the original file name to current **time, day, month & year** as its new file name.

Just after renaming the file's name, it moves the image file to a folder named **uploaded_item_images** inside the **public** directory which has been made default directory with the new name joining it's file extension to it.

Also the files that can be uploaded are just images with extension either **.jpg, .png, .jpeg, .gif** as it would bounce back the upload, if the file selected to be uploaded by the user does not include any of the extension above.


**How This Web Application Works**

1. When page loads it gets the data from the database with simple route call back function.

2. Adding new item's route is located in the index.js.

3. Deleting item is proceesed with ajax in jQuery located in *public/js/script.js* and then get response from it's route in the index.js.

4. Editing item's route is located in the index.js.

5. The styling and JavaScript files can be found in the public folder.

**Detailed Can Be Found With The index.js File**