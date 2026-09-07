import EventEmitter from "events";
import os from "node:os";
import { useRuntimeConfig } from "./env";
import { logger } from "./logger";

export interface NetworkInterface {
  name: string;
  family: string;
  address: string;
  mac: string;
}

export interface SysInfo {
  cups: os.CpuInfo[];
  // ips: NetworkInterface[];
  host: string;
  platform: string;
  release: string;
  totalmem: number;
  uptime: number;
  version: string;
  arch: string;
}

const Env = useRuntimeConfig()?.NODE_ENV || "development";

const eventEmitter = new EventEmitter();

eventEmitter.on("error", (err) => {
  logger.error(err);
});

process.on("warning", (warning) => {
  logger.warn(warning);
});

process.on("uncaughtException", (err) => {
  console.error(err);
  logger.error(err);
  if (Env !== "production") {
    process.exit(1);
  }
});

process.on("unhandledRejection", (err) => {
  console.error(err);
  logger.error(err);
  if (Env !== "production") {
    process.exit(1);
  }
});

const interfaces = os.networkInterfaces() || {};
const ips: NetworkInterface[] = [];

export function getLocalIP(version: string = "IPv4") {
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === version) {
        ips.push({
          name,
          address: iface.address,
          family: iface.family,
          mac: iface.mac,
        });
        return iface.address;
      }
    }
  }
  return null;
}

export function getIPV4() {
  return getLocalIP("IPv4");
}

export function getIPV6() {
  return getLocalIP("IPv6");
}

export function getIPs() {
  return ips;
}

const sysInfo = new Map<number, SysInfo>();

export function getSysInfo() {
  const date = new Date().getTime();

  const values = [...sysInfo.values()];
  const keys = [...sysInfo.keys()];

  // 保留最近10次 系统信息
  if (sysInfo.size > 10) {
    sysInfo.delete(keys[0]);
  }

  // 每5分钟采集一次系统信息
  const time = keys[sysInfo.size - 1];
  if (time && date - time < 5 * 60 * 1000) {
    return values[values.length - 1];
  }

  const sysObj = {
    // ips,
    cups: os.cpus(),
    host: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    totalmem: os.totalmem(),
    uptime: os.uptime(),
    version: os.version(),
    arch: os.arch(),
  };

  sysInfo.set(date, sysObj);
  return sysObj;
}
