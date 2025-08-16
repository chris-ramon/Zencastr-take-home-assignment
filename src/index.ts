import { Service } from "./cache/service";

const service = new Service();

service.add("key", "123");
console.log(service.get("key"));
service.remove("key");
console.log(service.get("key"));
