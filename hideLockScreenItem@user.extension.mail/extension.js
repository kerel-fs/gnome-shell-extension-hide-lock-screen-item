import GLib from 'gi://GLib';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as systemActions from 'resource:///org/gnome/shell/misc/systemActions.js';

export default class HideLockScreenItemExtension extends Extension {
    init() {
        // store pristine function
        this.matchingActions = systemActions.getDefault().getMatchingActions;
    }

    enable() {
        // replace with our modified implementation
        systemActions.getDefault().getMatchingActions = this._removeMatchingActions;
    }

    disable() {
        // restore pristine function
        systemActions.getDefault().getMatchingActions = matchingActions;
    }

    _removeMatchingActions(terms) {
        // terms is a list of strings
        terms = terms.map(
            term => GLib.str_tokenize_and_fold(term, null)[0]).flat(2);

        // tokenizing may return an empty array
        if (terms.length === 0)
            return [];
    
        let results = [];

        for (let [key, {available, keywords}] of this._actions) {
            if (available && terms.every(t => keywords.some(k => k.startsWith(t)))) {
                if (key != 'lock-screen')
                    results.push(key);
            }
        }
        return results;
    }
}
