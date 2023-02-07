// Define the array of sizes
var sizes = [
  { width: new UnitValue(5, "in"), height: new UnitValue(7, "in") },
  { width: new UnitValue(8, "in"), height: new UnitValue(10, "in") },
  { width: new UnitValue(9, "in"), height: new UnitValue(12, "in") },
  { width: new UnitValue(11, "in"), height: new UnitValue(14, "in") },
  { width: new UnitValue(16, "in"), height: new UnitValue(20, "in") },
  { width: new UnitValue(18, "in"), height: new UnitValue(24, "in") },
  { width: new UnitValue(24, "in"), height: new UnitValue(36, "in") },
  { width: new UnitValue(42, "cm"), height: new UnitValue(59.4, "cm") },
];

var saveOptions = new JPEGSaveOptions();
saveOptions.quality = 12;

// Get the current active document
var doc = app.activeDocument;

// The name of the main document
var docPath = doc.path;
var docName = doc.name.replace(/\.[^.]+$/, "");

// Loop through the array of sizes
for (var i = 0; i < sizes.length; i++) {
  // Store the current state
  var state = doc.activeHistoryState;
  // Calculate the crop area
  var aspectRatio = doc.width / doc.height;
  var targetRatio = sizes[i].width.as("px") / sizes[i].height.as("px");
  var height = doc.height;
  var width = height * targetRatio;

  // Calculate the crop area
  var x = (doc.width - width) / 2;
  var y = (doc.height - height) / 2;
  var cropArea = [x, y, x + width, y + height];
  // Crop the image
  doc.crop(cropArea);
  doc.resizeImage(
    sizes[i].width,
    sizes[i].height,
    null,
    ResampleMethod.BICUBIC
  );

  // Export the image with the current size
  var file = new File(
    doc.path +
      "/" +
      doc.name.replace(/\.[^.]+$/, "") +
      "_" +
      sizes[i].width.as("in") +
      "x" +
      sizes[i].height.as("in") +
      ".jpg"
  );
  doc.saveAs(file, saveOptions, true, Extension.LOWERCASE);
  // Remove the current artboard
  doc.activeHistoryState = state;
}