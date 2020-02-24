import commonjs from '@rollup/plugin-commonjs';
import copy from "rollup-plugin-copy";
import resolve from '@rollup/plugin-node-resolve'
import {chromeExtension} from 'rollup-plugin-chrome-extension'
import del from 'rollup-plugin-delete'
import progress from 'rollup-plugin-progress';

export default {
    input    : 'src/manifest.json',
    output   :
    {
        dir    : 'dist',
        format : 'esm',
    },
    plugins  :
    [
        // always put chromeExtension() before other plugins
        chromeExtension(),
        // the plugins below are optional
        resolve(),
        commonjs(),
        del({targets : 'dist'}),
        progress({clearLine : false}),
        copy({
            targets : [
                {
                    src  : 'src/options/img',
                    dest : 'dist/options/'
                }],
            verbose : true,
        }),
    ],
}
