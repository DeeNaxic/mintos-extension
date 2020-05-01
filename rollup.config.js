import {chromeExtension} from 'rollup-plugin-chrome-extension'
import commonjs from '@rollup/plugin-commonjs';
import copy from "rollup-plugin-copy";
import del from 'rollup-plugin-delete'
import json from "@rollup/plugin-json";
import progress from 'rollup-plugin-progress';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve'

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
        json({
            preferConst : true,
        }),
        replace({
            '__BUILD_ENV__' : process.env.NODE_ENV,
        }),
    ],
}
