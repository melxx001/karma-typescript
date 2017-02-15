var MagicString = require("magic-string"),
  path = require("path"),
  ts = require("typescript");

module.exports = function angularStyleUrlsRewriter(context, callback) {
  var changed = false, magic = new MagicString(context.fullText);

  visitNode(context.sourceFile);

  function visitNode(node) {
    switch (node.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        if (node.properties) {
          node.properties.forEach(function(property) {
            if (property.name.text === "styleUrls") {
              var prop = property[0];

              var start = prop.initializer.getStart() + 1,
                end = start + prop.initializer.text.length,
                stylesDir = path.dirname(context.filename),
                relativeStylesDir = path.relative(context.basePath, stylesDir),
                styleUrls = path.join(
                  context.urlRoot,
                  "base",
                  relativeStylesDir,
                  prop.initializer.text
                );

              magic.overwrite(start, end, fixWindowsPath(stylesUrl));
              context.fullText = magic.toString();
              changed = true;
            }
          });
        }
    }

    ts.forEachChild(node, visitNode);
  }

  callback(changed);
};

function fixWindowsPath(value) {
  return value.replace(/\\/g, "/");
}
