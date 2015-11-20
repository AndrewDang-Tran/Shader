
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
  normalMapTexCoord = vec2(parametric.y, parametric.x);
  vec2 uv = radians(parametric*360.0);
  float smallRadius = torusInfo.y;
  float largeRadius = torusInfo.x;

  vec3 pos = vec3(  (largeRadius + smallRadius * cos(uv.x)) * cos(uv.y),
  					(largeRadius + smallRadius * cos(uv.x)) * sin(uv.y),
  					(smallRadius * sin(uv.x)));
  gl_Position = gl_ModelViewProjectionMatrix * vec4(pos.x, pos.y, pos.z, 1);

  eyeDirection = vec3(pos - eyePosition);
  eyeDirection = normalize(eyeDirection);
  lightDirection = vec3(pos - lightPosition); 
  lightDirection = normalize(eyeDirection);

  halfAngle = (eyeDirection + lightDirection) / 2.0; 

  vec3 tangent = vec3(  (largeRadius + smallRadius * -sin(uv.y)) * cos(uv.x),
  						(largeRadius + smallRadius * -sin(uv.x)) * sin(uv.y),
  						0.0);
  tangent = normalize(tangent);

  vec3 bitangent = vec3((largeRadius + smallRadius * cos(uv.x)) * -sin(uv.y),
  						(largeRadius + smallRadius * cos(uv.x)) * cos(uv.y),
  						0.0);
  bitangent = normalize(bitangent);

  vec3 normal = cross(tangent, bitangent);

  c0 = tangent;
  c1 = bitangent; 
  c2 = normal; 
}

