var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    formidable = require('formidable'),
    path = require('path')
    fs = require('fs')
    client = require('./db/connectDB');

var app = express();

app.engine('dust', cons.dust);

app.set('view engine', 'dust');

app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));


// Default route (Homepage)
app.get('/', (req, res) =>
{
    // Get all data from table in database name 'store'
    client.query(`SELECT * FROM store`, (TheErr, TheRes) =>
    {
        // If and error is encoutered
        if (TheErr)
        {
            // Display a notice to user
            res.status(500).send("We Encoutered An Error Publishing Item");
            console.log("We Encoutered An Error Publishing Item");
        }

        // If no error is encoutered, display the results
        res.render('home', {myItems: TheRes.rows});
    });
    
});




// Post request to add new item
app.post('/api/add-item', (req, res) =>
{
    // If the input form for either item's name or item's description or image file is not empty, proceed
    if (req.body.itemName != '' || req.body.itemDescription != '' || req.body.image != '')
    {
        // Get ready transform inputs
        var form = new formidable.IncomingForm();

        //Transform the inputs
        form.parse(req, function (err, fields, files)
        {
            //Get Image file's extension (if its .jpg, etc.)
            var getImageFileExtension = path.extname(files.image.name);
            
            //Check Image file's extension (if its .jpg, etc.)
            if(getImageFileExtension === '.jpg' || getImageFileExtension === '.jpeg' || getImageFileExtension === '.png' || getImageFileExtension === '.gif')
            {
                //Get Current Date and Time
                var today = new Date();
                var date = today.getFullYear()+''+(today.getMonth()+1)+''+today.getDate();
                var time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
                var dateTime = date+''+time;

                //Temporal Location Of Image file before upload
                var oldImagePath = files.image.path;

                //New name of image file which should be stored in folder *images* and saved as Current Date and Time, finally merging it's extension
                var newImagePath = './public/uploaded_item_images/' + dateTime+getImageFileExtension;

                // New image name with it's extension joined together
                const ImageAndPath = dateTime+getImageFileExtension;

                // Current Time & Date
                const CurrentTimeAndDay = Date();
                
                // Rename old image name with new name, moving it to its's specified path/folder 'uploaded_item_images'
                fs.rename(oldImagePath, newImagePath, function (err)
                {
                    // If error occurs display
                    if (err) 
                    {
                        throw err;
                    }
                    // If no error occured proceed
                    else
                    {
                        // Get the input data, remember I have already parsed it with formidable, so I've got to follow its sequence as I would be using fields.itemName instead of req.body.itemName
                        const realvalues = [fields.itemName, fields.itemDescription, ImageAndPath, fields.itemCategory, CurrentTimeAndDay, CurrentTimeAndDay];

                        // Insert data in variable above, to the database
                        client.query(`INSERT INTO store (item_name, description, image_name, item_category, created_at, updated_on) VALUES ($1, $2, $3, $4, $5, $6)`, realvalues, (TheErr, TheRes) =>
                        {
                            // If error is encountered while uploading to the database
                            if (TheErr)
                            {
                                // Display error to the user
                                res.status(500).send("We Encoutered An Error Publishing Item");
                                console.log("We Encoutered An Error Publishing Item");
                            }

                            // If upload was successful proceed
                            if (TheRes)
                            {
                                console.log("Item Successfully Uploaded To Store");

                                // Redirect user to Homepage thou the user wouldn't see this route process in front page
                                res.status(201).redirect('/');
                            }
                        });
                    }
                });
            }

            //If its none of the extensions listed above, It should process this else statement 
            else
            {
                // Redirect user to Homepage because the file uploaded was not listed in the option for the filkes to be accepted
                res.redirect('/');
                console.log('File Is Not Recognized As An Image, Here');
            }
        });
    }
    else
    {
        // Redirect user to Homepage because there was an empty field discorvered
        res.redirect('/');
        console.log('Empty Field Was Noted');
    }
});




// Delete request, that would be pushed from the jQuery's ajax process in script.js
app.delete('/api/delete-item/:id', (req, res) =>
{
    // Select all data from store table in database where it's id equals to the parameter passed from the item in the ajax query
    client.query(`SELECT * FROM store WHERE id = $1`, [req.params.id], (WeErr, WeRes) =>
    {
        // If error occured while fetching data
        if (WeErr)
        {
            // Display a notice to user
            res.status(500).send("We Encoutered An Error Getting Item Details");
            console.log("We Encoutered An Error Getting Item Details");
        }

        // If there was no error and a data was actually fetched
        if (WeRes.rows[0])
        {
            // Get the image's name from the database for that particular item
            const ImageName = WeRes.rows[0].image_name;

            // Delete every data linked the id passed as parameter from the database
            client.query(`DELETE FROM store WHERE id = $1`, [req.params.id], (TheErr, TheRes) =>
            {
                // If error occured
                if (TheErr)
                {
                    // Display a notice to the user
                    res.status(500).send("We Encoutered An Error Deleting Item");
                    console.log("We Encoutered An Error Deleting Item");
                }

                // if the deletion form the database was successful
                if (TheRes)
                {
                    //Delete the file from image folder with it's file name gotten earlier from the database at first
                    fs.unlink("./public/uploaded_item_images/"+ImageName, (err) =>
                    {
                        // If error occurs deleting the image file from the folder, which is most likely not to happen
                        if (err)
                        {
                            // Display the error
                            throw err;
                        }
                        // If the deletion from the folder was sucessful
                        else
                        {
                            console.log('Item Successfully Deleted From Store');

                            // Send a status-code 200, which the ajax will take as query had ran successfully
                            res.sendStatus(200);
                        }
                    });
                }
            });
        }
    });
});



// Make a POST request to edit item in Homepage (Note: PATCH request could have been used but POST request is okay too)
app.post('/api/edit-item', (req, res) =>
{
    // Get current Time & Date
    const CurrentTimeAndDay = Date();

    // Get the value from the input field in the edit item's modal form (Note: The user can not change image file, thats how I wanted it, so it's not a must)
    const realvalues = [req.body.itemName, req.body.itemDescription, req.body.itemCategory, CurrentTimeAndDay, req.body.id];
    
    // Update the store table in database with the gotten values above, Where the id equals the id gotten from the input field in the edit item's modal but its hidden in the form, from the user
    client.query(`UPDATE store SET item_name = $1, description = $2, item_category = $3, updated_on = $4 WHERE id = $5`, realvalues, (TheErr, TheRes) =>
    {
        // If error occured
        if (TheErr)
        {
            // Display an error notice
            res.status(500).send("We Encoutered An Error Updating Item In Store");
            console.log("We Encoutered An Error Updating Item In Store");
        }

        // If no error had occured while updating item's details
        if (TheRes)
        {
            console.log('Item In Store Successfully Updated');

            // Redirect user to Homepage (basically refreshing the page since a single page application, everything is being done in the Homepage)
            res.redirect('/');
        }
    });
});



const port = process.env.PORT || 3000;

app.listen(port, () =>
{
    console.log(`Server Running On port ${port}`);
});