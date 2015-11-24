
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
  vec2 texture = vec2(normalMapTexCoord.x, normalMapTexCoord.y);

  vec3 lightDirectionNorm = normalize(lightDirection);
  vec2 textureValue = vec2(normalMapTexCoord.x, normalMapTexCoord.y);
  vec3 normal = vec3(texture2D(normalMap, textureValue));
  normal = 2.0 * normal - 1.0;
  normal = normalize(normal);
  float diffuse = dot(lightDirectionNorm, normal);
  diffuse = max(diffuse, 0.0);

  vec3 halfAngleNorm = normalize(halfAngle);
  float specular = dot(halfAngleNorm, normal);
  specular = pow(specular, shininess);
  specular = max(specular, 0.0);

  gl_FragColor = LMa + texture2D(decal, texture) * LMd * diffuse + LMs * specular;
}
