/**
 * HSV to RGB color conversion
 *
 * H runs from 0 to 360 degrees
 * S and V run from 0 to 100
 *
 * http://snipplr.com/view/14590
 */
function hsvToRgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;
	 
	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));
	 
	// We accept saturation and value arguments from 0 to 100 because that's
	// how Photoshop represents those values. Internally, however, the
	// saturation and value are calculated from a range of 0 to 1. We make
	// That conversion here.
	s /= 100;
	v /= 100;
	 
	if(s == 0) {
		// Achromatic (grey)
		r = g = b = v;
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
	 
	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));
	 
	switch(i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		 
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		 
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		 
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		 
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		 
		default: // case 5:
			r = v;
			g = p;
			b = q;
	}
	 
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hsvToHex(h, s, v) {
	var rgb = hsvToRgb(h, s, v);
	return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function distinctHexColors(count) {
    var colors = [];
    for(var hue = 0; hue < 360; hue += 360 / count) {
        colors.push(hsvToHex(hue, 100, 100));
    }
    return colors;
}

function colorLuminance(color, lum) {
	var hex = colorToHex(color);
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;
	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
}

function colorLuminance2(color, lum) {
	var hex = colorToHex(color);
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');	
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];		
	}
	lum = lum || 0;
	// convert to decimal and change luminosity
	var rgb = "#", c, i;	
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);			
		c = Math.round(Math.min(Math.max(0, c * lum), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
}


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function colorToHex(c) {
	var m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(c);
	return m ? '#' + (1 << 24 | m[1] << 16 | m[2] << 8 | m[3]).toString(16).substr(1) : c;
}

//returns brightness value from 0 to 255
//http://www.webmasterworld.com/forum88/9769.htm
//https://gist.github.com/geekmy/5010419
function get_brightness(hexCode) {
	// strip off any leading #
	hexCode = hexCode.replace('#', '');

	var c_r = parseInt(hexCode.substr(0, 2),16);
	var c_g = parseInt(hexCode.substr(2, 2),16);
	var c_b = parseInt(hexCode.substr(4, 2),16);

	return ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
}

function highlightColor(color, lum) {
	var hex = colorToHex(color);	
	if (get_brightness(hex) > 160) {
		// too bright, need to darken it
		if (lum > 0) {
			lum = -lum;
		}		
	} else {		
		if (lum < 0) {
			lum = -lum;
		}
	}	
	var result = colorLuminance(color, lum);
	if (color == result) {
		// avoid same color
		result = colorLuminance2(color, lum);
	}
	return result;
}
