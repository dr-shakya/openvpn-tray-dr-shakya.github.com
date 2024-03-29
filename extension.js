/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import St from 'gi://St';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const Indicator = GObject.registerClass(
  class Indicator extends PanelMenu.Button {
    _init() {
      super._init(0.0, _('Connected to OpenVPN'));

      this._vpnIcon = new St.Icon({
        icon_name: 'network-vpn-symbolic',
        style_class: 'system-status-icon'
      });
      this.add_child(this._vpnIcon);

      this._vpnCheckTimeoutId = null;
    }

    _checkVPN() {
      let [res, out, err, status] = GLib.spawn_command_line_sync('pgrep openvpn');
      if (out.length > 0) {
        this._vpnIcon.show();
        this.show();
      } else {
        this._vpnIcon.hide();
        this.hide();
      }
      this._vpnCheckTimeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 10, this._checkVPN.bind(this));
    }

    enable() {
      this._checkVPN();
    }

    disable() {
      if (this._vpnCheckTimeoutId) {
        GLib.source_remove(this._vpnCheckTimeoutId);
        this._vpnCheckTimeoutId = null;
      }
      this.remove_child(this._vpnIcon);
    }
  }
);

export default class OpenVpnTrayExtension extends Extension {
  enable() {
    this._indicator = new Indicator();
    Main.panel.addToStatusArea(this.uuid, this._indicator);
    this._indicator.enable();
  }

  disable() {
    this._indicator.disable();
    this._indicator.destroy();
    this._indicator = null;
  }
}
