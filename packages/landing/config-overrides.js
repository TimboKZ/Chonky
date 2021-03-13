module.exports = function override(config, env) {
    config.resolve.plugins.pop();

    // Let Babel compile outside of src/.
    const tsRule = config.module.rules[2].oneOf[1];
    tsRule.include = undefined;
    tsRule.exclude = /node_modules/;

    return config;
};
