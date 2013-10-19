define(['collection/abstract', 'collection/array', 'collection/keyValue'],
    function(AbstractCollection, ArrayCollection, KeyValueCollection)
{
    'use strict';
    
    var Collection = {
        Abstract: AbstractCollection,
        Array: ArrayCollection,
        KeyValue: KeyValueCollection
    };
    
    return Collection;
});