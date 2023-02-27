const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const St = imports.gi.St;
const Mainloop = imports.mainloop

//This is the command in the nav_bar bash file
//it doesn't work to just pass it to the glib..
const command = 'echo - | awk "{printf \"%.1f\",$(($(cat /sys/class/power_supply/BAT0/current_now) * $(cat /sys/class/power_supply/BAT0/voltage_now))) / 1000000000000 }" ; echo " W "'


let panelButt, panButtText, timeout;

function setButtonText() {
  var [ok, out, err, exit] = GLib.spawn_command_line_sync('nav_pwr');
  

  if (out.toString() == "0.0 W") {
    panButtText.set_text('');
  } else {
    panButtText.set_text(out.toString());
  }
  return true;
}
function init() {
  panelButt = new St.Bin({
    style_class : "panelButt"
  });
  panButtText = new St.Label({
    style_class : "panButtText",
    text : "init.."
  });
  panelButt.set_child(panButtText, 1);
}

function enable() {
  Main.panel._rightBox.insert_child_at_index(panelButt, 1);
  timeout = Mainloop.timeout_add_seconds(1.0, setButtonText);
}

function disable() {
  Mainloop.source_remove(timeout);
  Main.panel._rightBox.remove_child(panelButt, 1);
}
