const requireAll = (requireContext) => requireContext.keys().map(requireContext);
const req = require.context('./svg', false, /\.svg$/);
const data = requireAll(req);
const tbmIcons = data.map((item) => {
  let index = item.default.id.indexOf('-') + 1;
  return item.default.id.substring(index);
});

export default tbmIcons;
