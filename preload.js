const { ipcRenderer, contextBridge } = require("electron");
const keytar = require("keytar");

const mainPassword = () => keytar.getPassword("package-electron", "user");

const rendererPassword = async () => {
	let rendererPassword = await keytar.getPassword(
		"package-electron-renderer",
		"user"
	);
	if (!rendererPassword) {
		await keytar.setPassword("package-electron-renderer", "user", "password");
		rendererPassword = await keytar.getPassword(
			"package-electron-renderer",
			"user"
		);
	}
	return rendererPassword;
};

contextBridge.exposeInMainWorld("electron", {
	main: {
		mainPassword: () => ipcRenderer.invoke("getMainPassword"),
		rendererPassword: () => ipcRenderer.invoke("getRendererPassword"),
	},
	renderer: {
		rendererPassword,
		mainPassword,
	},
});
