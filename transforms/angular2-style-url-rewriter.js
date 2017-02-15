var MagicString = require("magic-string"),
  path = require("path"),
  ts = require("typescript");

module.exports = function angularStyleUrlRewriter(context, callback) {
  var changed = false, magic = new MagicString(context.fullText);

  visitNode(context.sourceFile);

  function visitNode(node) {
    switch (node.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        if (node.properties) {
          node.properties.forEach(function(property) {
            if (property.name.text === "styleUrl") {
              var start = property.initializer.getStart() + 1,
                end = start + property.initializer.text.length,
                styleDir = path.dirname(context.filename),
                relativeStyleDir = path.relative(context.basePath, styleDir),
                styleUrl = path.join(
                  context.urlRoot,
                  "base",
                  relativeStyleDir,
                  property.initializer.text
                );

              magic.overwrite(start, end, fixWindowsPath(styleUrl));
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
