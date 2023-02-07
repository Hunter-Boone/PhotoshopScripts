// Define the list of target sizes
var sizes = [  [5, 7],
  [8, 10],
  [9, 12],
  [11, 14],
  [16, 20],
  [18, 24],
  [24, 36],
  [420, 594] // ISO-A2 size
];

// Get the current active document
var doc = app.activeDocument;

// Get the original width and height of the document
var originalWidth = doc.width;
var originalHeight = doc.height;

// Loop through the list of target sizes
for (var i = 0; i < sizes.length; i++) {
  // Save the current history state
  var historyState = doc.activeHistoryState;

  // Calculate the aspect ratio of the target size
  var targetRatio = sizes[i][0] / sizes[i][1];

  // Calculate the aspect ratio of the original image
  var originalRatio = originalWidth / originalHeight;
  var cropWidth, cropHeight, x, y; 
  // Determine if the original image needs to be cropped vertically or horizontally
  if (targetRatio > originalRatio) {
    // The original image needs to be cropped vertically
    cropWidth = originalWidth;
    cropHeight = originalWidth / targetRatio;
    x = 0;
    y = (originalHeight - cropHeight) / 2;
  } else {
    // The original image needs to be cropped horizontally
    cropWidth = originalHeight * targetRatio;
    cropHeight = originalHeight;
    x = (originalWidth - cropWidth) / 2;
    y = 0;
  }

  // Crop the image to the target aspect ratio
  doc.crop([x, y, cropWidth, cropHeight]);

  // Export the resized document as a JPEG
  var filename = sizes[i][0] + "x" + sizes[i][1] + " inches.jpg";
  var jpegOptions = new ExportOptionsSaveForWeb();
  jpegOptions.format = SaveDocumentType.JPEG;
  jpegOptions.quality = 100;
  doc.exportDocument(new File(filename), ExportType.SAVEFORWEB, jpegOptions);

  // Return to the saved history state
  doc.activeHistoryState = historyState;
}
alert("Done");
