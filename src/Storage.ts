function requiresUpdate(currentComponent, createdComponents) {
	// enable this features only in _reactInternalFiber available
	if (!currentComponent._reactInternalFiber || !currentComponent._reactInternalFiber._debugOwner) {
		return true;
	}
	let parent = currentComponent._reactInternalFiber._debugOwner.stateNode;
	while (parent) {
		if (parent._reactInternalFiber._debugOwner) {
			parent = parent._reactInternalFiber._debugOwner.stateNode;
		} else {
			parent = null;
		}
		if (createdComponents.find(created => created === parent)) {
			return false;
		}
	}
	return true;
}

export class ReactStorage {
	public $components: Array<any>;
	constructor() {
		Object.defineProperty(this, "$components", {
			value: [],
			enumerable: false,
			writable: true
		});
	}
	public notify() {
		this.$components.map(component => {
			if (component.isComponentMounted && requiresUpdate(component, this.$components)) {
				component.forceUpdate();
			}
		});
	}
}
