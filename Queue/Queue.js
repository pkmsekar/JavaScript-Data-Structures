/**
 * Created by Stefano on 31/03/14.
 */

Queue.prototype = new Aggregate();
Queue.prototype.constructor = Queue;

/**
 * Class for managing a queue.
 * @param {...*} [args] The items for initializing the queue.
 * @constructor
 */
function Queue(args) {
	/**
	 * The list of the items in the queue.
	 * @type {Array<*>}
	 */
	this.items = [];

	//builds the queue from the parameters of the constructor
	this.multiEnqueue(arguments);
}

/**
 * @inheritDoc
 */
Queue.prototype.getIterator = function () {
	return new QueueIterator(this);
};

/**
 * Adds the item at the tail of the queue.
 * @param item {*} The item to add.
 * @return {void}
 */
Queue.prototype.enqueue = function (item) {
	this.items.push(item);
};

/**
 * Adds the items at the tail of the queue.
 * @param items {Array<*>} The items to add.
 * @return {void}
 */
Queue.prototype.multiEnqueue = function (items) {
	for (var i = 0; i < items.length; i++)
		this.items.push(items[i]);
};

/**
 * Removes the item at the head of the queue.
 * @return {*} The item at the head of the queue. It's undefined if the queue is empty.
 */
Queue.prototype.dequeue = function () {
	if (!this.items.length)
		return undefined;
	return this.items.splice(0, 1)[0]; //remove the first item and return it
};

/**
 * Removes the items at the head of the queue.
 * @param times {number} The number of times to repeat the dequeue method.
 * @return {Array<*>} The items at the head of the queue.
 */
Queue.prototype.multiDequeue = function (times) {
	return this.items.splice(0, times); //removes the last times item and returns the array
};

/**
 * Removes the first length items from the position index.
 * @param index {number} The position where to start to remove the items.
 * @param [length = 1] {number} The number of items to remove.
 * @return {void}
 */
Queue.prototype.remove = function (index, length) {
	length = length || 1;
	this.items.splice(index, length);
};

/**
 * Returns the item at the position index.
 * @param index {number} The position of the item.
 * @return {*} The item at the position. It's undefined if index isn't in the queue bounds.
 */
Queue.prototype.getItem = function (index) {
	if (index < 0 || index > this.items.length - 1)
		return undefined;
	return this.items[index];
};

/**
 * Returns the first item in the queue. The item is not removed.
 * @return {*} The first item. It's undefined if the queue is empty.
 */
Queue.prototype.peek = function () {
	if (this.items.length)
		return this.items[0];
	return undefined
};

/**
 * Removes all the items stored in the queue.
 * @return {void}
 */
Queue.prototype.clear = function () {
	this.items = [];
};

/**
 * Checks if the queue contains an item that satisfy the condition represented by the callback function.
 * @param item {*} The item to find.
 * @param [callback = function(item){return(it===item);}] The condition to satisfy. The callback must accept the current item to check.
 * @return {boolean} True if the queue contains the item that satisfy the condition, false otherwise.
 */
Queue.prototype.contains = function (item, callback) {
	callback = callback || function (it) {
		return it === item;
	};
	var i = 0;
	while (i < this.items.length && !callback(this.items[i]))
		i++;
	return i < this.items.length;
};

/**
 * Executes the callback function for each item of the queue.
 * This method modifies the queue so if you don't need to modify it you must return the same item of the array.
 * @param callback {function} The function to execute for each item. The function must accept the current item on which execute the function.
 * @return {void}
 */
Queue.prototype.execute = function (callback) {
	for (var i = 0; i < this.items.length; i++)
		this.items[i] = callback(this.items[i]);
};

/**
 * Returns the length of the queue.
 * @return {number} The length of the queue.
 */
Queue.prototype.getLength = function () {
	return this.items.length;
};

/**
 * Checks if the queue is empty.
 * @return {boolean} True if the queue is empty, false otherwise.
 */
Queue.prototype.isEmpty = function () {
	return !this.items.length;
};

/**
 * Returns the items that satisfy the condition determined by the callback.
 * @param callback {function} The function that implements the condition.
 * @return {Array<*>} The array that contains the items that satisfy the condition.
 */
Queue.prototype.filter = function (callback) {
	var result = [];
	for (var i = 0; i < this.items.length; i++)
		if (callback(this.items[i]))
			result.push(this.items[i]);
	return result;
};

/**
 * Returns the first position of the item in the queue.
 * @param item {*} The item to search.
 * @param [callback = function(item){return(it===item);}] The condition to satisfy. The callback must accept the current item to check.
 * @return {number} The first position of the item.
 */
Queue.prototype.indexOf = function (item, callback) {
	callback = callback || function (it) {
		return it === item;
	};
	var i = 0;
	while (i < this.items.length) {
		if (callback(this.items[i]))
			return i;
		i++;
	}
	return -1;
};

/**
 * Returns the last position of the item in the queue.
 * @param item {*} The item to search.
 * @param [callback = function(item){return(it===item);}] The condition to satisfy. The callback must accept the current item to check.
 * @return {number} The last position of the item.
 */
Queue.prototype.lastIndexOf = function (item, callback) {
	callback = callback || function (it) {
		return it === item;
	};
	var i = this.items.length - 1;
	while (i > -1) {
		if (callback(this.items[i]))
			return i;
		i--;
	}
	return -1;
};

/**
 * Returns all the position in which the item has been found in the queue.
 * @param item {*} The item to search.
 * @param [callback = function(item){return(it===item);}] The condition to satisfy. The callback must accept the current item to check.
 * @return {Array<number>} The positions in which the item has been found.
 */
Queue.prototype.allIndexesOf = function (item, callback) {
	callback = callback || function (it) {
		return it === item;
	};
	var i = 0;
	var indexes = [];
	while (i < this.items.length) {
		if (callback(this.items[i]))
			indexes.push(i);
		i++;
	}
	return indexes;
};

/**
 * Clones the queue into a new queue.
 * @return {Queue} The queue cloned from this queue.
 */
Queue.prototype.clone = function () {
	var queue = new Queue();
	for (var i = 0; i < this.items.length; i++)
		if (this.items[i].clone)
			queue.enqueue(this.items[i].clone());
		else
			queue.enqueue(this.items[i]);

	return queue;
};

/**
 * Clones the queue into a new queue without cloning duplicated items.
 * @return {Queue} The queue cloned from this queue.
 */
Queue.prototype.cloneDistinct = function () {
	var queue = new Queue();
	for (var i = 0; i < this.items.length; i++)
		if (!queue.contains(this.items[i]))
			if (this.items[i].cloneDistinct)
				queue.enqueue(this.items[i].cloneDistinct());
			else if (this.items[i].clone)
				queue.enqueue(this.items[i].clone());
			else
				queue.enqueue(this.items[i]);
	return queue;
};