const createBtn = document.getElementById('create')!;
const updateBtn = document.getElementById('update')!;
const deleteBtn = document.getElementById('delete')!;
const readBtn = document.getElementById('read')!;
const output = document.getElementById('CRUD-output')!;
const form = document.getElementById('CRUD-form')!;
const deviceID = document.getElementById('device-id') as HTMLInputElement;
const deviceName = document.getElementById('device-name') as HTMLInputElement;
const deviceType = document.getElementById('device-type') as HTMLInputElement;
const deviceStatus = document.getElementById('device-status') as HTMLSelectElement;
const deviceBatteryLevel = document.getElementById('device-battery-level') as HTMLInputElement;

const devices = [
    {
        deviceID: 1,
        deviceName: 'Device 1',
        deviceType: 'Type 1',
        deviceStatus: 'Active',
        deviceBatteryLevel: 100
    },
    {
        deviceID: 2,
        deviceName: 'Device 2',
        deviceType: 'Type 2',
        deviceStatus: 'Inactive',
        deviceBatteryLevel: 50
    },
    {
        deviceID: 3,
        deviceName: 'Device 3',
        deviceType: 'light',
        deviceStatus: 'Inactive',
        deviceBatteryLevel: 25
    },
    {
        deviceID: 4,
        deviceName: 'Device 4',
        deviceType: 'light',
        deviceStatus: 'Unknown',
        deviceBatteryLevel: 75
    }
]
document.addEventListener('DOMContentLoaded', () => {
    init();
});
document.addEventListener('close', () => {
    localStorage.clear();
});
function init() {
    createBtn!.addEventListener('click', () => {
        createDevice(parseInt(deviceID.value), deviceName.value, deviceType.value, deviceStatus.value, parseInt(deviceBatteryLevel.value));
    });
    updateBtn!.addEventListener('click', () => {
        updateDevice(parseInt(deviceID.value), deviceName.value, deviceType.value, deviceStatus.value, parseInt(deviceBatteryLevel.value));
    });
    deleteBtn!.addEventListener('click', () => {
        deleteDevice(parseInt(deviceID.value));
    });
    readBtn!.addEventListener('click', () => {
        readDevice(parseInt(deviceID.value));
    });
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });
    devices.forEach(device => {
        localStorage.setItem(device.deviceID.toString(), JSON.stringify(device));
    })
}
function readDevice(deviceID: number){
    const loaded_device = localStorage.getItem(deviceID.toString());
    if (loaded_device){
        output.innerHTML = loaded_device;
    } else {
        output.innerHTML = `Device with ID ${deviceID} not found`;
    }
}
function createDevice(deviceID: number, deviceName: string, deviceType: string, deviceStatus: string, deviceBatteryLevel: number){
    localStorage.setItem(deviceID.toString(), JSON.stringify({
        "deviceID": deviceID,
        "deviceName": deviceName,
        "deviceType": deviceType,
        "deviceStatus": deviceStatus,
        "deviceBatteryLevel": deviceBatteryLevel
    }));
    output.innerHTML = `Device with ID ${deviceID} created`;
}
function updateDevice(deviceID: number, deviceName: string, deviceType: string, deviceStatus: string, deviceBatteryLevel: number){
    const loaded_device = localStorage.getItem(deviceID.toString());
    if (loaded_device){
        const updatedDevice = JSON.parse(loaded_device);
        if (deviceName) updatedDevice.deviceName = deviceName;
        if (deviceType) updatedDevice.deviceType = deviceType;
        if (deviceStatus) updatedDevice.deviceStatus = deviceStatus;
        if (!isNaN(deviceBatteryLevel)) updatedDevice.deviceBatteryLevel = deviceBatteryLevel;
        localStorage.setItem(deviceID.toString(), JSON.stringify(updatedDevice));
        output.innerHTML = `Device with ID ${deviceID} updated`;
    } else {
        output.innerHTML = `Device with ID ${deviceID} not found`;
    }
}
function deleteDevice(deviceID: number){
    const loaded_device = localStorage.getItem(deviceID.toString());
    if (loaded_device){
        localStorage.removeItem(deviceID.toString());
        output.innerHTML = `Device with ID ${deviceID} deleted`;
    } else {
        output.innerHTML = `Device with ID ${deviceID} not found`;
    }
}
