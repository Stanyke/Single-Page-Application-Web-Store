// On-bodyload, get this function ready
$(document).ready(function()
{
    // On delete button icon's click with class attribute 'delete-item', run this function
    $('.delete-item').on('click', function()
    {
        // Get attribute 'data-id' value from the home.dust file
        let ItemId = $(this).data('id');

        // Get the route needed with the value gotten above as it's parameter that would be passed for the specified item
        let RouteUrl = '/api/delete-item/'+ItemId;

        // Get attribute 'itemName' value from the home.dust file
        let ItemName = $(this).attr('itemName');

        if(confirm('Delete Item: '+ItemName+'?'))
        {
            $.ajax({
                url: RouteUrl,
                type: 'DELETE',
                success: function(result)
                {
                    console.log('Deleting Item...');
                    window.location.href = '/';
                },
                error: function(err)
                {
                    console.log(err);
                }
            })
        }
    })



    $('.edit-item').on('click', function()
    {
        $('#edit-item-itemName').val($(this).data('name'));
        $('#edit-item-itemDescription').val($(this).data('description'));
        $('#edit-item-itemCategory').val($(this).data('category'));
        $('#edit-item-id').val($(this).data('id'));

    })
})