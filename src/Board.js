import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }

  componentDidMount() {
    const { backlog, inProgress, complete } = this.swimlanes;
    this.drake = Dragula([
      backlog.current,
      inProgress.current,
      complete.current,
    ]);

    this.drake.on('drop', (el, target, source, sibling) => {
      this.drake.cancel(true);
      this.handleCardDrop(el, target, sibling);
    });
  }

  componentWillUnmount() {
    if (this.drake) {
      this.drake.destroy();
    }
  }

  handleCardDrop(el, target, sibling) {
    if (!target) return;

    let targetLaneKey = 'backlog';
    let targetStatus = 'backlog';

    if (target === this.swimlanes.inProgress.current) {
      targetLaneKey = 'inProgress';
      targetStatus = 'in-progress';
    } else if (target === this.swimlanes.complete.current) {
      targetLaneKey = 'complete';
      targetStatus = 'complete';
    }

    const cardId = el.dataset.id;
    const siblingId = sibling ? sibling.dataset.id : null;

    this.setState(prevState => {
      const updatedClients = {
        backlog: [...prevState.clients.backlog],
        inProgress: [...prevState.clients.inProgress],
        complete: [...prevState.clients.complete],
      };

      let movedCard = null;
      for (const laneKey of Object.keys(updatedClients)) {
        const idx = updatedClients[laneKey].findIndex(
          card => String(card.id) === String(cardId)
        );
        if (idx !== -1) {
          [movedCard] = updatedClients[laneKey].splice(idx, 1);
          break;
        }
      }

      if (!movedCard) return null;

      const updatedCard = { ...movedCard, status: targetStatus };
      const targetLane = updatedClients[targetLaneKey];

      if (siblingId) {
        const insertIdx = targetLane.findIndex(
          card => String(card.id) === String(siblingId)
        );
        if (insertIdx !== -1) {
          targetLane.splice(insertIdx, 0, updatedCard);
        } else {
          targetLane.push(updatedCard);
        }
      } else {
        targetLane.push(updatedCard);
      }

      return { clients: updatedClients };
    });
  }

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: 'backlog',
    }));
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref}/>
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
