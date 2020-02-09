// On-bodyload, get this function ready
$(document).ready(function()
{
    // On delete button icon's click with class attribute 'delete-item' from the home.dust file, run this function
    $('.delete-item').on('click', function()
    {
        // Get attribute 'data-id' value from the home.dust file
        let ItemId = $(this).data('id');

        // Get the route needed with the value gotten above as it's parameter that would be passed for the specified item
        let RouteUrl = '/api/delete-item/'+ItemId;

        // Get attribute 'itemName' value from the home.dust file
        let ItemName = $(this).attr('itemName');

        // Alert dialogue before confirming delete
        if(confirm('Delete Item: '+ItemName+'?'))
        {
            // if the user confirms delete, run the ajax query to make request to the route located in the index.js file in the root directory.
            $.ajax({
                url: RouteUrl,
                type: 'DELETE',
                success: function(result)
                {
                    // If the route recognizes the item to be deleted and is done (returning status-code 200)
                    console.log('Deleting Item...');

                    // Refresh the page
                    window.location.href = '/';
                },
                error: function(err)
                {
                    // Give out the error, since it had occured but we wouldn't be expecting this
                    console.log(err);
                }
            })
        }
    })



    // On edit button icon's click with class attribute 'edit-item' from the home.dust file, run this function
    $('.edit-item').on('click', function()
    {
        // Get the value in the attribute named 'data-name' from the home.dust file and replace the value in the edit modal with id 'edit-item-itemName', with the gotten value
        $('#edit-item-itemName').val($(this).data('name'));

        // Get the value in the attribute named 'data-description' from the home.dust file and replace the value in the edit modal with id 'edit-item-itemDescription', with the gotten value
        $('#edit-item-itemDescription').val($(this).data('description'));

        // Get the value in the attribute named 'data-category' from the home.dust file and replace the value in the edit modal with id 'edit-item-itemCategory', with the gotten value
        $('#edit-item-itemCategory').val($(this).data('category'));

        // Get the value in the attribute named 'data-id' from the home.dust file and replace the value in the edit modal with id 'edit-item-id', with the gotten value
        $('#edit-item-id').val($(this).data('id'));

    })
})