// Define the file path
// Replace this path with the path to your mockups
var landscapeMockups = ["\\path\\to\\poster-mockup-landscape-1.psd",
                        "\\path\\to\\poster-mockup-landscape-2.psd",
                        "\\path\\to\\poster-mockup-landscape-3.psd"];
// Replace PLACEHOLDER with whatever the name of the layer that the smart object is called
// (this is the object/layer that you double click to open up and paste your image in)
var smartObjectName = "PLACEHOLDER";
// This is the name of the layer that holds the smart object layer. Rename to whatever layer holds it
var frameLayerName = "Frame";

// Change this to portrait or landscape so your export can have a good naming convention
var landscapeOrPortrait = "landscape";

// Merge all layers into one layer
app.activeDocument.mergeVisibleLayers();

// Rename the merged layer to "POSTER"
app.activeDocument.activeLayer.name = "POSTER";
var posterLayer = app.activeDocument.artLayers.getByName("POSTER");
posterLayer.copy();

for (var index = 0; index < landscapeMockups.length; index++) {
  // Open the PSD file
  app.open(new File(landscapeMockups[index]));

  // Find the group named "FRAME"
  var frameGroup;
  for (var i = 0; i < app.activeDocument.layerSets.length; i++) {
      if (app.activeDocument.layerSets[i].name == frameLayerName) {
          frameGroup = app.activeDocument.layerSets[i];
          break;
      }
  }

  // Find the smart object layer named "PLACEHOLDER" within the "FRAME" group
  var placeholderLayer;
  for (var i = 0; i < frameGroup.artLayers.length; i++) {
      if (frameGroup.artLayers[i].name == smartObjectName && frameGroup.artLayers[i].kind == LayerKind.SMARTOBJECT) {
          placeholderLayer = frameGroup.artLayers[i];
          break;
      }
  }

  // Edit the smart object named smartObjectName
  app.activeDocument.activeLayer = placeholderLayer;

  app.runMenuItem(stringIDToTypeID('placedLayerEditContents'));
  // Perform edits on the smart object contents
  // Paste the image onto the smart object
  var pastedLayer = app.activeDocument.paste();

  // Resize pasted layer to cover the whole canvas
  // Get the size of the canvas
  var canvasWidth = app.activeDocument.width;
  var canvasHeight = app.activeDocument.height;

  // Get the size of the active layer
  var layerWidth = pastedLayer.bounds[2] - pastedLayer.bounds[0];
  var layerHeight = pastedLayer.bounds[3] - pastedLayer.bounds[1];

  // Calculate the new width and height of the layer
  var newWidth = canvasWidth;
  var newHeight = canvasHeight;

  // Maintain the aspect ratio of the layer while resizing
  if (layerWidth / layerHeight < canvasWidth / canvasHeight) {
      newHeight = canvasWidth * (layerHeight / layerWidth);
  } else {
      newWidth = canvasHeight * (layerWidth / layerHeight);
  }

  // Resize the active layer to fill the canvas
  pastedLayer.resize(newWidth / layerWidth * 100, newHeight / layerHeight * 100, AnchorPosition.TOPLEFT);


  // Close the smart object contents
  app.activeDocument.close(SaveOptions.SAVECHANGES);

  // Export the image with the current size
  var file = new File(
    docPath +
      "/" +
      docName +
      "_" + landscapeOrPortrait + "_" +
      index +
      ".jpg"
  );

  saveOptions.quality = 6;
  doc.saveAs(file, saveOptions, true, Extension.LOWERCASE);
  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}