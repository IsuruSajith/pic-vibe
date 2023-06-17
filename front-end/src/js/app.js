const overlay = $("#overlay");
const btnUpload = $("#btn-upload");
const dropZoneElm = $("#drop-zone");
const mainElm = $("main");
const REST_API_URL = `http://localhost:8080/gallery`;
const cssLoaderHtml = `<div class="lds-facebook"><div></div><div></div><div></div></div>`;

loadAllImages();

btnUpload.on('click', () => overlay.removeClass('d-none'));
overlay.on('click', (evt) => {
    if (evt.target === overlay[0]) overlay.addClass('d-none');
});
$(document).on('keydown', (evt) => {
    if (evt.key === 'Escape' && !overlay.hasClass('d-none')) {
        overlay.addClass('d-none');
    }
});
overlay.on('dragover', (evt) => evt.preventDefault());
overlay.on('drop', (evt) => evt.preventDefault());
dropZoneElm.on('dragover', (evt) => {
    evt.preventDefault();
});
dropZoneElm.on('drop', (evt) => {
    evt.preventDefault();
    const droppedFiles = evt.originalEvent
        .dataTransfer.files;
    const imageFiles = Array.from(droppedFiles)
        .filter(file => file.type.startsWith("image/"));
    if (!imageFiles.length) return;
    overlay.addClass("d-none");
    uploadImages(imageFiles);
});
mainElm.on('click', '.image:not(.loader)', (evt)=> {
    evt.target.requestFullscreen();
});

function uploadImages(imageFiles){
    const formData = new FormData();
    imageFiles.forEach(imageFile => {
        const divElm = $(`<div class="image loader"></div>`);
        divElm.append(cssLoaderHtml);
        mainElm.append(divElm);

        formData.append("images", imageFile);
    });
    const jqxhr = $.ajax(`${REST_API_URL}/images`, {
        method: 'POST',
        data: formData,
        contentType: false,         // by default jQuery uses application/x-www-form-urlencoded
        processData: false          // by default jQuery tries to convert the data into String
    });

    jqxhr.done((imageUrlList)=> {
        imageUrlList.forEach(imageUrl => {
            const divElm = $(".image.loader").first();
            divElm.css('background-image', `url('${imageUrl}')`);
            divElm.empty();
            divElm.removeClass('loader');
        });
    });
    jqxhr.always(()=> $(".image.loader").remove());
}

function loadAllImages() {
    const jqxhr = $.ajax(`${REST_API_URL}/images`);
    jqxhr.done((imageUrlList) => {
        imageUrlList.forEach(imageUrl => {
            const divElm = $(`<div class="image"></div>`);
            divElm.css('background-image', `url(${imageUrl})`);
            mainElm.append(divElm);
        });
    });
    jqxhr.fail(() => {
    });
}