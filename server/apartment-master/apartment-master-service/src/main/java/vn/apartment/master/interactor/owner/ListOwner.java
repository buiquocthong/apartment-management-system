package vn.apartment.master.interactor.owner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.owner.OwnerDTO;
import vn.apartment.master.dto.owner.OwnerPageDTO;
import vn.apartment.master.dto.owner.SimpleOwnerDTO;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.mapper.OwnerMapper;
import vn.apartment.master.service.OwnerService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListOwner {

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private OwnerMapper ownerMapper;

    @Transactional(readOnly = true)
    public OwnerPageDTO execute(ApiQuery apiQuery) {
        Page<Owner> pageResult = ownerService.findMatchingOwners(apiQuery);
        List<SimpleOwnerDTO> dtos = pageResult.get()
                .map(ownerMapper::toSimpleDTO)
                .collect(Collectors.toList());
        return new OwnerPageDTO(pageResult.getTotalElements(), dtos);
    }
}
