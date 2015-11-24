
attribute vec2 parametric;

uniform vec3 lightPosition;  // Object-space
uniform vec3 eyePosition;    // Object-space
uniform vec2 torusInfo;

varying vec2 normalMapTexCoord;

varying vec3 lightDirection;
varying vec3 halfAngle;
varying vec3 eyeDirection;
varying vec3 c0, c1, c2;

void main()
{
  normalMapTexCoord = vec2(parametric.x  * -6.0, parametric.y * 2.0);
  vec2 uv = radians(parametric*360.0);
  float smallRadius = torusInfo.y;
  float largeRadius = torusInfo.x;

  float cosU = cos(uv.x);
  float cosV = cos(uv.y);
  float sinU = sin(uv.x);
  float sinV = sin(uv.y);

  vec3 pos = vec3(  (largeRadius + smallRadius * cosV) * cosU,
  					(largeRadius + smallRadius * cosV) * sinU,
  					(smallRadius * sinV));
  gl_Position = gl_ModelViewProjectionMatrix * vec4(pos.x, pos.y, pos.z, 1);

  vec3 tangent = vec3((largeRadius + smallRadius * cosV) * -sinU,
              (largeRadius + smallRadius * cosV) * cosU,
               0.0);
  tangent = normalize(tangent);

  vec3 bitangent = vec3(  (smallRadius * -sinV) * cosU,
              (smallRadius * -sinV) * sinU,
               smallRadius * cosV);
  bitangent = normalize(bitangent);

  vec3 normal = cross(tangent, bitangent);

  c0 = tangent;
  c1 = bitangent;
  c2 = normal;

  mat3 surfaceToObject = mat3(c0, c1, c2);
  vec3 localPosition = surfaceToObject * pos;

  lightDirection = lightPosition - localPosition; 
  eyeDirection = eyePosition - localPosition;

  mat3 objectToSurface = transpose(surfaceToObject);

  eyeDirection = objectToSurface * eyeDirection;
  lightDirection = objectToSurface * lightDirection;
  halfAngle = (eyeDirection + lightDirection) / 2.0;
}

