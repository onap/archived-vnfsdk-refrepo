/* Copyright 2016, Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function Topology(containerId) {

    /**
     * IMPORTANT: This only works with the canvas renderer. TBD in the future
     * will also support the WebGL renderer.
     */
    sigma.utils.pkg('sigma.canvas.nodes');

    this.s = new sigma({
        graph: {
            nodes: [],
            edges: []
        },
        renderer: {
            // IMPORTANT:
            // This works only with the canvas renderer, so the
            // renderer type set as "canvas" is necessary here.
            container: document.getElementById(containerId),
            type: 'canvas'
        },
        settings: {
            minNodeSize: 4,
            maxNodeSize: 48,
            edgeLabelSize: 'proportional'
        }
    });
    this.addNode = addNode;
    this.addEdge = addEdge;
}

function addNode(node) {

    this.s.graph.addNode(node);

}

function addEdge(edge) {
    this.s.graph.addEdge(edge);
}

function init() {

    var node1 = new Node("1", "ThinCPE", 8, "type1", 0.2, 0.5);
    var node2 = new Node("2", "vCPE", 8, "type1", 0.5, 0.5);
    var node3 = new Node("3", "VPC", 16, "type2", 0.8, 0.5);

    var node4 = new Node("4", "Site", 16, "type3", 0.2, 0.55);
    var node5 = new Node("5", "POP", 24, "type3", 0.5, 0.55);
    var node6 = new Node("6", "DC", 32, "type3", 0.8, 0.55);

    var node7 = new Node("7", "vFW", 6, "type1", 0.45, 0.45);
    var node8 = new Node("8", "vLB", 6, "type1", 0.55, 0.45);

    var edge1 = new Edge("e1", "VxLAN", "1", "2", 0.5, "blue");
    var edge2 = new Edge("e2", "IPSec", "2", "3", 0.5, "green");

    var edge3 = new Edge("e3", "in", "1", "4", 0.5, "grey");
    var edge4 = new Edge("e4", "in", "2", "5", 0.5, "grey");
    var edge5 = new Edge("e5", "in", "3", "6", 0.5, "grey");

    var edge6 = new Edge("e6", "L2VPN", "4", "5", 0.5, "black");
    var edge7 = new Edge("e7", "L3VPN", "5", "6", 0.5, "black");

    var edge8 = new Edge("e8", "", "2", "7", 0.5, "yellow");
    var edge9 = new Edge("e9", "", "7", "8", 0.5, "yellow");
    var edge10 = new Edge("e10", "", "8", "2", 0.5, "yellow");

    var topology = new Topology("container");

    topology.addNode(node1);
    topology.addNode(node2);
    topology.addNode(node3);
    topology.addNode(node4);
    topology.addNode(node5);
    topology.addNode(node6);
    topology.addNode(node7);
    topology.addNode(node8);

    topology.addEdge(edge1);
    topology.addEdge(edge2);
    topology.addEdge(edge3);
    topology.addEdge(edge4);
    topology.addEdge(edge5);


    topology.addEdge(edge6);
    topology.addEdge(edge7);
    topology.addEdge(edge8);
    topology.addEdge(edge9);
    topology.addEdge(edge10);

    CustomShapes.init(topology.s);
    topology.s.refresh();
}

$(document).ready(function () {
    init();
});