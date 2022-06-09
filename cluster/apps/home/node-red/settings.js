module.exports = {
    /** The file containing the flows. If not set, defaults to flows_<hostname>.json **/
    flowFile: 'flows.json',

    credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET,

    flowFilePretty: true,

    uiPort: process.env.PORT || 1880,
    uiHost: "0.0.0.0",

    apiMaxLength: '10mb',

    lang: "en-US",

    logging: {
        console: {
            level: "debug",
            metrics: false,
            audit: false
        }
    },

    exportGlobalContextKeys: false,

    /** Configure how the runtime will handle external npm modules.
     * This covers:
     *  - whether the editor will allow new node modules to be installed
     *  - whether nodes, such as the Function node are allowed to have their
     * own dynamically configured dependencies.
     * The allow/denyList options can be used to limit what modules the runtime
     * will install/load. It can use '*' as a wildcard that matches anything.
     */
    // externalModules: {
        // autoInstall: false,   /** Whether the runtime will attempt to automatically install missing modules */
        // autoInstallRetry: 30, /** Interval, in seconds, between reinstall attempts */
        // palette: {              /** Configuration for the Palette Manager */
        //     allowInstall: true, /** Enable the Palette Manager in the editor */
        //     allowUpdate: true,  /** Allow modules to be updated in the Palette Manager */
        //     allowUpload: true,  /** Allow module tgz files to be uploaded and installed */
        //     allowList: ['*'],
        //     denyList: [],
        //     allowUpdateList: ['*'],
        //     denyUpdateList: []
        // },
        // modules: {              /** Configuration for node-specified modules */
        //     allowInstall: true,
        //     allowList: [],
        //     denyList: []
        // }
    // },


    /** Customising the editor
     * See https://nodered.org/docs/user-guide/runtime/configuration#editor-themes
     * for all available options.
     */
    editorTheme: {
        /** The following property can be used to set a custom theme for the editor.
         * See https://github.com/node-red-contrib-themes/theme-collection for
         * a collection of themes to chose from.
         */
        //theme: "",
        // palette: {
            /** The following property can be used to order the categories in the editor
             * palette. If a node's category is not in the list, the category will get
             * added to the end of the palette.
             * If not set, the following default order is used:
             */
            //categories: ['subflows', 'common', 'function', 'network', 'sequence', 'parser', 'storage'],
        // },
        projects: {
            enabled: true,
            workflow: {
                mode: "manual"
            }
        },
        codeEditor: {
            /** Select the text editor component used by the editor.
             * Defaults to "ace", but can be set to "ace" or "monaco"
             */
            lib: "ace",
            options: {
                /** The follow options only apply if the editor is set to "monaco"
                 *
                 * theme - must match the file name of a theme in
                 * packages/node_modules/@node-red/editor-client/src/vendor/monaco/dist/theme
                 * e.g. "tomorrow-night", "upstream-sunburst", "github", "my-theme"
                 */
                theme: "vs",
                /** other overrides can be set e.g. fontSize, fontFamily, fontLigatures etc.
                 * for the full list, see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandaloneeditorconstructionoptions.html
                 */
                //fontSize: 14,
                //fontFamily: "Cascadia Code, Fira Code, Consolas, 'Courier New', monospace",
                //fontLigatures: true,
            }
        }
    },

    /** Allow the Function node to load additional npm modules directly */
    functionExternalModules: true,

    /** The following property can be used to set predefined values in Global Context.
     * This allows extra node modules to be made available with in Function node.
     * For example, the following:
     *    functionGlobalContext: { os:require('os') }
     * will allow the `os` module to be accessed in a Function node using:
     *    global.get("os")
     */
    // functionGlobalContext: {
        // os:require('os'),
    // },

    /** The maximum length, in characters, of any message sent to the debug sidebar tab */
    debugMaxLength: 1000,

    /** Retry time in milliseconds for MQTT connections */
    mqttReconnectTime: 15000,

    /** Retry time in milliseconds for Serial port connections */
    serialReconnectTime: 15000,
}
