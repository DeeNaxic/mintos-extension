import test from 'ava';
import {userLang} from "./index.js";

test('the language of /webapp/en/yada page is en', t =>
{
    t.is('en', userLang('/webapp/en/yada'));
});

test('the language of /en/yada page is en', t =>
{
    t.is('en', userLang('/en/yada'));
});
