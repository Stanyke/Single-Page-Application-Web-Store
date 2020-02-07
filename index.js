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


app.get('/', (req, res) =>
{
    client.query(`SELECT * FROM store`, (TheErr, TheRes) =>
    {
        if (TheErr)
        {
            res.status(500).send("We Encoutered An Error Publishing Item");
            console.log("We Encoutered An Error Publishing Item");
        }

        res.render('home', {myItems: TheRes.rows});
    });
    
})

app.post('/api/add-item', (req, res) =>
{
    if (req.body.itemName != '' || req.body.itemDescription != '' || req.body.image != '')
    {
        var form = new formidable.IncomingForm();
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

                const ImageAndPath = dateTime+getImageFileExtension;

                const CurrentTimeAndDay = Date();
                
                fs.rename(oldImagePath, newImagePath, function (err)
                {
                    if (err) 
                    {
                        throw err;
                    }
                    else
                    {
                        const realvalues = [fields.itemName, fields.itemDescription, ImageAndPath, fields.itemCategory, CurrentTimeAndDay];

                        client.query(`INSERT INTO store (item_name, description, image_name, item_category, time) VALUES ($1, $2, $3, $4, $5)`, realvalues, (TheErr, TheRes) =>
                        {
                            if (TheErr)
                            {
                                res.status(500).send("We Encoutered An Error Publishing Item");
                                console.log("We Encoutered An Error Publishing Item");
                            }

                            if (TheRes)
                            {
                                console.log("Item Successfully Uploaded To Store");
                                res.status(201).redirect('/');
                            }
                        });
                    }
                });
            }

            //If its none of the extensions listed above, It should process this else statement 
            else
            {
                res.redirect('/');
                console.log('File Is Not Recognized As An Image, Here');
            }

            
        });
    }
    else
    {
        res.redirect('/');
        console.log('Empty Field Was Noted');
    }
})

const port = process.env.PORT || 3000;

app.listen(port, () =>
{
    console.log(`Server Running On port ${port}`);
});