
uniform vec4 LMa; // Light-Material ambient
uniform vec4 LMd; // Light-Material diffuse
uniform vec4 LMs; // Light-Material specular
uniform float shininess;

uniform sampler2D normalMap;
uniform sampler2D decal;
uniform sampler2D heightField;
uniform samplerCube envmap;

uniform mat3 objectToWorld;

varying vec2 normalMapTexCoord;
varying vec3 lightDirection;
varying vec3 eyeDirection;
varying vec3 halfAngle;
varying vec3 c0, c1, c2;

void main()
{
  mat3 surfaceToObject = mat3(c0, c1, c2);
  vec3 eyeDirectionObject = (surfaceToObject * normalize(eyeDirection));
  eyeDirectionObject = normalize(eyeDirectionObject);
  vec3 reflection = reflect(-eyeDirectionObject, c2);
  reflection = normalize(reflection);
  vec3 reflectionWorld = objectToWorld * reflection;
  reflectionWorld = normalize(reflectionWorld);
  gl_FragColor = textureCube(envmap, reflectionWorld);
  gl_FragColor = clamp(gl_FragColor, 0.0, 1.0);
}
