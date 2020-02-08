$(document).ready(function()
{
    $('.delete-item').on('click', function()
    {
        let ItemId = $(this).data('id');
        let RouteUrl = '/api/delete-item/'+ItemId;

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