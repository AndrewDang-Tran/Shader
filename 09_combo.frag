
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
  vec3 lightDirectionNorm = normalize(lightDirection);

  //decal
  vec2 texture = vec2(normalMapTexCoord.x, normalMapTexCoord.y);
  vec4 decalValue = texture2D(decal, texture);

  //get perturbed normal
  vec2 textureValue = vec2(normalMapTexCoord.x, normalMapTexCoord.y);
  vec3 normal = vec3(texture2D(normalMap, textureValue));
  normal = 2.0 * normal - 1.0;
  normal = normalize(normal);

  //compute diffuse
  float diffuse = dot(lightDirectionNorm, normal);
  diffuse = max(diffuse, 0.0);

  //compute specular
  vec3 halfAngleNorm = normalize(halfAngle);
  float specular = dot(halfAngleNorm, normal);
  specular = pow(specular, shininess);
  specular = max(specular, 0.0);

  //bumpy reflection
  mat3 surfaceToObject = mat3(c0, c1, c2);
  vec3 eyeDirectionObject = (surfaceToObject * normalize(eyeDirection));
  eyeDirectionObject = normalize(eyeDirectionObject);

  vec3 reflection = reflect(-eyeDirectionObject, normal);
  reflection = normalize(reflection);
  vec3 reflectionWorld = objectToWorld * reflection;
  vec4 reflectionValue = textureCube(envmap, reflectionWorld);

  gl_FragColor = 0.5 * (LMa + LMd * diffuse * decalValue) + 0.5 *(LMs * specular) + 0.6 * reflectionValue;
}
