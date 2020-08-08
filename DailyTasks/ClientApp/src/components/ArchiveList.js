import React, { Component } from 'react';
import _ from 'lodash';
import Title from './Title'
import Tabs from './control/Tabs'
import Control from './control/Control'
import Form from './control/Form'
import TaskList from './gridData/TaskList'
import ConfirmModal from './control/ConfirmModal'
import { taskService } from '../services';
import TaskModal from "./control/TaskModal";

class ArchiveList extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            items: [],
            inputSearch: '',
            isShowAddForm: false,
            sortName: 'priority',
            sortDir: 'desc',
            itemSelected: null,
            showModal: false,
            deletedItem: null
        };

        this.handleToggleAddForm = this.handleToggleAddForm.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        this.handleAddTask = this.handleAddTask.bind(this);
        this.handleBindingSelectedItem = this.handleBindingSelectedItem.bind(this);
        this.handleEditTask = this.handleEditTask.bind(this);
        this.handleOpenConfirmModal = this.handleOpenConfirmModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    handleToggleAddForm() {
        this.setState({
            itemSelected: null,
            isShowAddForm: !this.state.isShowAddForm
        });
    }

    handleSearch(inputSearch) {
        this.setState({ inputSearch });
    }

    handleSort(sortName, sortDir) {
        this.setState({ sortName, sortDir });
    }

    handleOpenConfirmModal(deletedItem) {
        this.setState({ showModal: true, deletedItem })
    }

    handleCloseModal() {
        this.setState({ showModal: false })
    }

    deleteItem(id) {
        taskService.delete(id).then(() => {
            this.getDataFromDB(false);
        });
    }

    handleDeleteItem(id) {
        this.deleteItem(id);
        this.handleCloseModal();
    }


    handleAddTask(task) {
        const addTask = _.assign({}, { ...task }, { isDone: false });
        taskService.insert(addTask).then(() => {
            this.getDataFromDB();
        })
    }

    handleEditTask(task) {
        taskService.update(task).then(() => {
            this.getDataFromDB();
        });
    }

    handleBindingSelectedItem(itemSelected) {
        this.setState({ itemSelected, isShowAddForm: true });
    }
    
    getDataFromDB () {
        taskService.getArchive()
            .then(data => {
                this.setState({ items: data, isShowAddForm: false });
            });
    }

    componentWillMount() {
        this.getDataFromDB();
    }

    componentDidMount() {
    }

    render() {
        let addForm = null;

        let { isShowAddForm, items, sortDir, sortName, inputSearch, itemSelected, showModal, deletedItem } = this.state;
        // if (isShowAddForm) {
        //     addForm = <Form itemSelected={itemSelected} onAddTask={this.handleAddTask} onEditTask={this.handleEditTask} onClickCancel={this.handleToggleAddForm} />;
        // }

        items = inputSearch.length > 0 ? items.filter(i => _.includes(_.toLower(i.taskName), _.toLower(inputSearch))) : items;
        items = _.orderBy(items,[sortName],[sortDir]);
        const listName = 'Archive tasks';
        const listStyle = 'panel panel-default';

        return (
            <div>
                <Title />
                <Tabs />
                <Control
                    onClick = {this.handleToggleAddForm()}
                    isShowAddForm = {isShowAddForm}
                    onClickSearch = {this.handleSearch}
                    onClickSort = {this.handleSort}
                />
                {/*{ addForm }*/}
                <TaskList
                    editItem={this.handleBindingSelectedItem}
                    openConfirmModal={this.handleOpenConfirmModal}
                    items={items}
                    listName={listName}
                    listStyle={listStyle}
                />
                <ConfirmModal
                    show={showModal} deletedItem={deletedItem ?? {}}
                    handleCloseModal={this.handleCloseModal}
                    handleDeleteItem={this.handleDeleteItem}
                />
                <TaskModal
                    show={isShowAddForm}
                    itemSelected={itemSelected}
                    onAddTask={this.handleAddTask}
                    onEditTask={this.handleEditTask}
                    onClickCancel={this.handleToggleAddForm}
                />
                
            </div>
        );
    }
}

export default ArchiveList;
