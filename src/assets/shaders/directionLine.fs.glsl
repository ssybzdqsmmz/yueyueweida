precision mediump float;
uniform vec4 color;
czm_material czm_getMaterial(czm_materialInput materialInput){
		czm_material material = czm_getDefaultMaterial(materialInput);
		vec2 st = materialInput.st;
		vec4 colorImage = texture2D ( image, vec2(fract(st.s * 10.0 - ( czm_frameNumber * 0.01)), st.t));
		material.diffuse = (1.0-colorImage.r)*color.rgb + colorImage.rgb*color.rgb;
		material.alpha = colorImage.a;
		return material;
}