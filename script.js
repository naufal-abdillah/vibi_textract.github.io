var _PDF_DOC,
_CANVAS = document.querySelector('#pdf-preview'),
_OBJECT_URL;


function fileValidation(file) {
    var fileInput =
        document.getElementById('file');
     
    var filePath = fileInput.value;
 
    // Allowing file type
    var allowedExtensions =
            /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
     
    if (!allowedExtensions.exec(filePath)) {
        alert('Please input PDF, PNG, JPEG, JPG format file');
        fileInput.value = '';
        return false;
    }
    else {
        // Image preview
        if (fileInput.files && fileInput.files[0]) {
            if(fileInput.value.split('.').pop() == "pdf"){
                document.querySelector('#pdf-preview').width = 150;
                document.querySelector('#imagePreview').style.display = 'none';
                _OBJECT_URL = URL.createObjectURL(fileInput.files[0]);
                showPDF(_OBJECT_URL);
            }
            else{
                document.querySelector('#pdf-preview').height = 0;
                document.querySelector('#imagePreview').style.display = 'inline-block';
                var reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById(
                        'imagePreview').innerHTML =
                        '<img src="' + e.target.result
                        + '" height="200px"/>';
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
            
        }
    }
}





function showPDF(pdf_url) {
	PDFJS.getDocument({ url: pdf_url }).then(function(pdf_doc) {
        
		_PDF_DOC = pdf_doc;
		showPage(1);

		// destroy previous object url
    	URL.revokeObjectURL(_OBJECT_URL);
	}).catch(function(error) {
		alert(error.message);
	});;
}

function showPage(page_no) {
    // fetch the page
    _PDF_DOC.getPage(page_no).then(function(page) {
        _CANVAS = document.querySelector('#pdf-preview');
        // set the scale of viewport
        // alert(_CANVAS);
        var scale_required = _CANVAS.width / page.getViewport(1).width;
        
        // get viewport of the page at required scale
        var viewport = page.getViewport(scale_required);

        // set canvas height
        _CANVAS.height = viewport.height;

        var renderContext = {
            canvasContext: _CANVAS.getContext('2d'),
            viewport: viewport
        };
        
        // render the page contents in the canvas
        
        page.render(renderContext).then(function() {
            document.querySelector("#pdf-preview").style.display = 'inline-block';
        });
        
    });
}






/* Selected File has changed */
document.querySelector("#file").addEventListener('change', function() {
    // user selected file
    var file = this.files[0];

    // allowed MIME types
    var mime_types = ['application/pdf'];



    // object url of PDF 
    _OBJECT_URL = URL.createObjectURL(file);

    // send the object url of the pdf to the PDF preview function
    showPDF(_OBJECT_URL);
});



